# Test Markdown Linting Compliance

This document demonstrates proper markdown formatting according to the repository's `.markdownlint.json` configuration.

## Configuration Summary

The repository enforces the following markdownlint rules:

- **MD013**: Line length limited to 600 characters (this line is well under the limit)
- **MD024**: Duplicate headers allowed (disabled, so we can repeat headers)
- **MD033**: HTML in markdown allowed (disabled, so `<div>` tags are permitted)
- **MD034**: Bare URLs allowed (disabled, so https://example.com works)
- **MD041**: First line must be top-level header (disabled, so we can start with other content if needed)
- **MD060**: Fenced code blocks allowed (disabled, so we can use ```code``` freely)

## Code Block Example

Here's a properly formatted code block with language specification:

```javascript
function validateMarkdown(content) {
  // This follows proper formatting
  return content.length < 600;
}
```

## List Examples

Unordered list using hyphens (consistent style):

- First item
- Second item
- Third item with a longer description that still stays under the 600 character line limit

Ordered list:

1. Step one
2. Step two
3. Step three

## Links and URLs

- Proper link: [Example](https://example.com)
- Bare URL (allowed): https://github.com
- Email: contact@example.com

## Headers Demonstration

### Level 3 Header

Content under level 3.

#### Level 4 Header

Content under level 4.

### Another Level 3 Header

This demonstrates that duplicate header levels are allowed (MD024 disabled).

## Conclusion

This markdown file should pass all markdownlint checks configured in the repository's `.markdownlint.json` file.