const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

module.exports = {
  outDir: path.resolve(__dirname, 'dist'),
  hooks: {
    preMake: async () => {
      // Kill any running ArgusTM instances to release file locks
      if (process.platform === 'win32') {
        try { execSync('taskkill /IM agentictm.exe /F /T 2>nul', { stdio: 'ignore' }); } catch {}
      }
      // Clean old squirrel output to avoid EBUSY locks
      const squirrelDir = path.resolve(__dirname, 'dist', 'make', 'squirrel.windows');
      try { fs.rmSync(squirrelDir, { recursive: true, force: true }); } catch {}
    },
  },
  packagerConfig: {
    name: 'ArgusTM',
    executableName: 'agentictm',
    asar: false,
    icon: path.resolve(__dirname, 'electron', 'icons', 'icon'),
    extraResource: [
      path.resolve(__dirname, 'agentictm'),
      path.resolve(__dirname, 'run.py'),
      path.resolve(__dirname, 'cli.py'),
      path.resolve(__dirname, 'main.py'),
      path.resolve(__dirname, 'logo-philocyber.png'),
      path.resolve(__dirname, 'requirements.txt'),
      path.resolve(__dirname, 'pyproject.toml'),
      path.resolve(__dirname, 'rag'),
    ],
    ignore: [
      /^\/\.venv/,
      /^\/\.git/,
      /^\/\.github/,
      /^\/\.cursor/,
      /^\/out/,
      /^\/dist/,
      /^\/output/,
      /^\/data/,
      /^\/docs/,
      /^\/tests/,
      /^\/reporte\.pdf$/,
      /^\/\.dockerignore$/,
      /^\/Dockerfile$/,
      /^\/docker-compose\.yml$/,
    ],
  },
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux', 'win32'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO',
      },
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'ArgusTM',
        setupIcon: path.resolve(__dirname, 'electron', 'icons', 'icon.ico'),
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'PhiloCyber',
          homepage: 'https://github.com/philocyber/ArgusTM',
          icon: path.resolve(__dirname, 'electron', 'icons', 'logo.png'),
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          homepage: 'https://github.com/philocyber/ArgusTM',
          icon: path.resolve(__dirname, 'electron', 'icons', 'logo.png'),
        },
      },
    },
  ],
};
