// Markdown-lite helpers for lesson bodies (see the header of content/lessons.ts).

/** Joins blocks (paragraphs or bullet lists) with a blank line. */
export const md = (...blocks: string[]): string => blocks.join('\n\n');

/** Builds one bullet-list block ("- item" lines). */
export const ul = (...items: string[]): string => items.map((item) => '- ' + item).join('\n');
