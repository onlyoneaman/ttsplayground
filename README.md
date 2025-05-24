# TTS Playground

> ⭐️ If you find this project useful, please consider [starring it on GitHub](https://github.com/onlyoneaman/ttsplayground) and sharing it with others!

A modern playground for experimenting with Text-to-Speech (TTS) features, built with Next.js, TypeScript, Tailwind CSS, and Shadcn UI. This project demonstrates best practices in code structure, styling, and component design, following the Airbnb Style Guide and custom conventions.

This project is **Open Source** and hosted at [ttsplayground.com](https://ttsplayground.com/).

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Linting & Style:** Airbnb Style Guide

## 📁 Directory Structure

```
app-playground/
├── src/
│   ├── components/    # Reusable React components (PascalCase files)
│   ├── pages/         # Next.js pages
│   ├── styles/        # Tailwind CSS config and global styles
│   └── ...
├── public/            # Static assets
├── README.md
├── package.json
└── ...
```

## 🛠️ Setup & Development

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

3. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## 🧑‍💻 Code Style & Conventions

- **Component Naming:** PascalCase for files and components (e.g., `Header.tsx`)
- **Exports:** Named export per file
- **Types:** Always declare types for variables, parameters, and return values. Avoid `any`.
- **Styling:** Use Tailwind CSS utility classes and Shadcn UI components
- **Immutability:** Prefer `readonly` and `as const` for immutable data
- **Functions:** Short, single-purpose, <20 lines; use arrow functions for simple logic
- **RO-RO:** Receive Object, Return Object for multi-parameter functions
- **No magic numbers:** Use named constants

## 🤝 Contributing

Pull requests are welcome! Please follow the code style and conventions outlined above.

### Open Source Best Practices
- Write clear, descriptive commit messages
- Open issues for bugs or feature requests
- Use pull requests for all contributions
- Follow the code of conduct
- Add tests for new features or bug fixes
- Keep documentation up to date

## Author

Made by [Aman](https://github.com/onlyoneaman) [amankumar.ai](https://amankumar.ai)

## 🙋‍♂️ Feedback

Have a feature request or found a bug? [Open an issue](https://github.com/onlyoneaman/ttsplayground/issues) on GitHub for:
- Feature requests
- Bug reports

## 📄 License

[MIT](LICENSE)
