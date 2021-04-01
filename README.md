#### simple-node-markdown-blog
# Simple Node Markdown Blog
simple-node-markdown-blog is essentially a static site generator in the context of a simple blog with automated searching and categorizing features.

It doesn't require a database.

It doesn't have an admin panel or a post tool.

Posts are authored in markdown and stored in the 'posts' directory before running the app.
When the app is run it will cache post titles, descriptions, and other metadata defined in YAML format at the beginning of the markdown files.
It will generate a homepage, RSS feed, and search functionality from the list of posts that it has identified.

When a post is requested, it finds a markdown file with that name and then renders it to HTML.

---

### Why?

I never needed the fancy editing features or CMS that came with things like Wordpress. I also didn't want to rely on another static site generator that I had to keep running over and over every time I made changes. This project has just enough features that I need with minimal overhead.

---

### How to Use
Your version control solution can be used to store and manage posts.

Write new posts in markdown with readable file names with no spaces (URLs will be based off of the markdown file names). Markdown files should have title, date, author, description, and bannerimg defined in YAML at the beginning of the file. Posts without a title will not be included in lists, searches, feeds, or the sitemap.

Run 'npm start' or deploy on your production machine.

#### Configuration
Blog name and tagline/description/bio can be defined in the config.env file or as environment variables at runtime.

Favicon can be replaced, it is located at 'simple-node-markdown-blog/static/img/icon.png'.

Layout is defined in the nunjucks template files, look and feel is determined by bootstrap (simple-node-markdown-blog/static/css/bootstrap.css). Default layouts defines styles using Bootstrap 5 beta classes.
