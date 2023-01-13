import MarkDownIt from "markdown-it";
import mk from "@traptitech/markdown-it-katex";

// ToDo: このファイルを廃止する

const md = new MarkDownIt();
md.use(mk);

export async function renderMarkdownToHTML(src: string) {
  return md.render(src);
}
