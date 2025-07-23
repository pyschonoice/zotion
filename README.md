
# ✨ Zotion 📝

Zotion is a completely open-source, Notion-like text editor built with **Next.js** and **Convex**. It offers a clean, minimal, and mobile-friendly experience, with the flexibility to self-host using your own Convex account.
---
## Hosted At

You can check out a live deployment of Zotion here: [zotion.pysn.space](https://zotion.pysn.space)

---

## Features

* **Minimal, Clean, and Mobile-Friendly UI:** Enjoy a distraction-free writing experience that looks great on any device.
* **Notion-Like Editor:** Leverage a rich text editing experience similar to Notion, with intuitive formatting and content creation.
* **Document-Nested Trees:** Organize your thoughts and notes hierarchically with nested documents for a clear overview of your workspace.
* **Full Search Feature:** Quickly find any information across your entire workspace with powerful search functionality.
* **Archive Functionality:** Keep your workspace tidy by archiving old or unused documents without permanently deleting them.
* **Publishable Documents:** Share your documents with the world by publishing them as public web pages.
* **Encrypted Documents:** Your content is encrypted, providing an extra layer of privacy and security for your notes.

---

## Future Features

I'm constantly working on improving Zotion! Here are some features planned for future releases:

* **Workspaces and Workspace Sharing:** Collaborate with others by creating shared workspaces.
* **Seamless Live Editing:** Experience real-time collaborative editing with other users, implemented through websockets.

---

## Technologies Used

* **Next.js:** A React framework for building fast and scalable web applications.
* **Convex:** A real-time backend as a service, providing the database and serverless functions.
* **BlockNote Editor:** A highly customizable block-based editor.
* **Shadcn/ui:** A collection of re-usable components for building beautiful user interfaces.
* **EdgeStore:** For efficient file storage.

---

## Local Development

To set up Zotion for local development, you'll need to configure the following environment variables:

1.  Create a `.env.local` file in the root of your project.
2.  Populate it with the following variables, obtaining the necessary keys from your Convex, Clerk, and EdgeStore accounts:

    ```
    CONVEX_DEPLOY_KEY=your_convex_deploy_key
    NEXT_PUBLIC_CONVEX_URL=your_public_convex_url
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_public_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_CLERK_ISSUER_URL=your_public_clerk_issuer_url
    EDGE_STORE_ACCESS_KEY=your_edgestore_access_key
    EDGE_STORE_SECRET_KEY=your_edgestore_secret_key
    ```

3.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
4.  Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## Contributing

Zotion is an open-source project, and I welcome contributions from the community!

* **Bug Fixes:** Found a bug? Please open an issue or submit a pull request with your fix.
* **Feature Requests:** Have an idea for a new feature? I'd love to hear it! Open an issue to discuss your proposal.

---

Made ❤️ by [pyschonoice](https://x.com/pyschonoice)