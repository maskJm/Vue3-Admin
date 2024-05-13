// 包管理器工具需要统一管理
if (!/pnpm/.test(process.env.npm_execpath || '')) {
    console.warn(
      `\u001b[33mThis repository must using pnpm as the package manager ` +
      ` for scripts to work properly.\u001b[39m\n`,
    )
    process.exit(1)
  }