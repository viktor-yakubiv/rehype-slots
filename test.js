import assert from "assert";
import unified from "unified";
import rehypeParse from "rehype-parse";
import rehypeSlots from "./index.js";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import h from "hastscript";

const input = `
<h1>
  <slot name="title"></slot>
</h1>
<article>
  <div>
    <slot name="quote"></slot>
  </div>
  <div>
    <slot name="author">Anonymous</slot>
  </div>
  <slot></slot>
</article>
`;

const values = {
  // a string that will create a text node
  title: "A Tale Of Two Cities",

  // a HAST tree that will be inserted
  quote: h("p", "It was the best of times..."),

  // a default slot
  [""]: h("p", "Rest of content"),
};

const expected = `
<h1>A Tale Of Two Cities</h1>
<article>
  <div>
    <p>It was the best of times...</p>
  </div>
  <div>Anonymous</div>
  <p>Rest of content</p>
</article>
`;

const expected2 = `
<h1>A Tale Of Two Cities</h1>
<article>
  <div>
    <p>It was the best of times...</p>
  </div>
  <div>
    <slot name="author">Anonymous</slot>
  </div>
  <p>Rest of content</p>
</article>
`;

function processDocument(input, optionsForRehypeSlots) {
  return unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSlots, optionsForRehypeSlots)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(input);
}

async function test() {
  const output = await processDocument(input, {
    values
  });

  assert.equal(output.contents, expected, "output equals expected");

  const output2 = await processDocument(input, { values, unwrap: false });

  assert.equal(output2.contents, expected2, "output2 equals expected2");
}

test().catch(error => {
  console.error(error);
  process.exit();
});
