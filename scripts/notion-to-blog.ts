import { NotionToMarkdown } from "notion-to-md";
import { Client } from "@notionhq/client";
import { writeFileSync } from "fs";
import * as dotenv from "dotenv";
import dayjs from "dayjs";
dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

// passing notion client to the option
const n2m = new NotionToMarkdown({ notionClient: notion });

(async () => {
  const pageId = process.env.NOTION_BLOG_PAGE;
  if (!pageId) {
    throw new Error("Missing NOTION_BLOG_PAGE environment variable");
  }
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
  });
  const syncCalloutBlock: Record<string, any> =
    blocks.results.find((block: any) => block.type === "callout") || {};
  const syncCalloutBlockId = syncCalloutBlock?.id;
  const syncTime = syncCalloutBlock.callout.rich_text[0].plain_text.replace(
    "Last sync time: ",
    ""
  ) || dayjs(0);
  const databaseId = blocks.results.find(
    (block: any) => block.type === "child_database"
  )?.id;
  if (!databaseId) {
    throw new Error("Missing database, please check your notion page");
  }
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "UpdatedTime",
      date: {
        on_or_after: syncTime,
      },
    },
    sorts: [
      {
        property: "UpdatedTime",
        direction: "descending",
      },
    ],
  });
  for (const page of response.results) {
    // @ts-ignore
    const { id, properties } = page;
    const title = properties.Name.title?.[0]?.plain_text;
    const updatedTime = properties.UpdatedTime.last_edited_time;
    const publishedTime = properties.PublishedTime.date?.start;
    if (dayjs(updatedTime).isBefore(dayjs(syncTime))) {
      continue;
    }
    const mdblocks = await n2m.pageToMarkdown(id);
    const mdString = n2m.toMarkdownString(mdblocks);
    const content = `---
title: ${title}
date: ${publishedTime ? dayjs(publishedTime).format('YYYY-MM-DD'): ''}
---

${mdString.parent}
`
    writeFileSync(`./content/blog/notion/${id}.md`, content);
  }
  notion.blocks.update({
    "block_id": syncCalloutBlockId,
    "callout": {
      "rich_text": [
        {
          "text": {
            "content": `Last sync time: ${dayjs().format('YYYY-MM-DD HH:mm')}`
          },
        }
      ]
    }
  })
})();
