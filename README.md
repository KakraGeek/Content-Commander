# Content Commander

A CLI tool for content creators to manage and generate content ideas, outlines, and drafts.

## Features

- Store and organize content ideas
- Search and filter your content collection
- Set due dates and view a content calendar
- Update and delete content ideas
- Content idea generation
- Outline creation
- Draft writing
- Image search integration
- Export to multiple formats

## Installation

```bash
npm install -g content-commander
```

## Commands

- `content-commander add` - Add a new content idea
- `content-commander list` - List all content ideas
- `content-commander search <term>` - Search for content ideas
- `content-commander filter [options]` - Filter content ideas
  - `-t, --type <type>` - Filter by content type
  - `-s, --status <status>` - Filter by status
  - `-g, --tag <tag>` - Filter by tag
- `content-commander update <id>` - Update a content idea
- `content-commander delete <id>` - Delete a content idea
- `content-commander calendar` - View content calendar
- `content-commander help` - Show help information

## Usage

```bash
# Generate a content idea
content-commander idea

# Create an outline
content-commander outline

# Write a draft
content-commander draft

# Search for images
content-commander images "your search term"

# Export content
content-commander export
```

## API Integrations

Content Commander integrates with the following external services:

### Unsplash API

Used for finding images related to your content ideas.

```bash
# Search for images related to a keyword
content-commander images "nature"
```

To use this feature, you need an Unsplash API key. You can get a free key at [https://unsplash.com/developers](https://unsplash.com/developers)

Set up your API key using the setup command:

```bash
content-commander setup
```

### Coming in Next Release

- AI Services (OpenAI, Anthropic) for generating outlines and content drafts

## Configuration

Content Commander uses a configuration file to store your settings and API keys. Run the setup command to configure:

```bash
content-commander setup
```

## Development

```bash
# Clone the repository
git clone https://github.com/KakraGeek/Content-Commander.git

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

## License

MIT