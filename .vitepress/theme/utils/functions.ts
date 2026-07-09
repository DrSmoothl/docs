export function countWord(data: string): number {
  // Strip markdown syntax before counting
  const cleaned = data
    .replace(/^---[\s\S]*?---/m, '')        // frontmatter
    .replace(/```[\s\S]*?```/g, '')          // code blocks
    .replace(/`[^`]*`/g, '')                 // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')         // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links (keep text)
    .replace(/[#>*_~|-]/g, '')               // markdown symbols

  const cn = cleaned.match(/[\u4e00-\u9fa5]/g)?.length || 0
  const en = cleaned.match(/\b[a-zA-Z]+\b/g)?.length || 0
  return cn + en
}
