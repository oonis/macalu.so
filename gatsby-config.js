module.exports = {
  siteMetadata: {
    title: `Sam Macaluso`,
    description: `Personal slice of the internet for Sam Macaluso`,
    author: `@oonis`,
    fullName: `Sam Macaluso`,
    githubHandle: 'https://github.com/oonis',
    linkedInHandle: 'https://www.linkedin.com/in/smaca'
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    // markdown to pages for blog
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/src/blog/`,
      },
    },
    // loading static data through GraphQL query
    `gatsby-transformer-javascript-frontmatter`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // favicon generator
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `favicon`,
        short_name: `favicon`,
        start_url: `/`,
        background_color: `#5badf0`,
        theme_color: `#5badf0`,
        display: `minimal-ui`,
        icon: `src/images/moustache.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sass`,
  ],
}
