export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 border-t border-gray-800 mt-12 pt-12 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src="/full_logo_white.png" alt="logo" className="h-8 mb-4" />
          <p className="text-lg font-semibold mb-2">
            9cscan is a Block Explorer and Analytics Platform for Nine Chronicles
          </p>
          <p className="text-sm text-gray-400">©2023 tx0x. All Rights Reserved.</p>
        </div>
        <div className="flex flex-col md:flex-row md:justify-end gap-8">
          <div>
            <div className="font-bold mb-2">Menu</div>
            <a href="/blocks" className="block text-gray-300 hover:text-white mb-1">
              Blocks
            </a>
            <a href="/transactions" className="block text-gray-300 hover:text-white mb-1">
              Transactions
            </a>
            <a href="/status" className="block text-gray-300 hover:text-white mb-1">
              Status
            </a>
          </div>
          <div>
            <div className="font-bold mb-2">Links</div>
            <a
              href="https://nine-chronicles.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-300 hover:text-white mb-1"
            >
              Nine Chronicles
            </a>
            <a
              href="https://docs.nine-chronicles.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-300 hover:text-white mb-1"
            >
              Docs
            </a>
            <a
              href="https://bit.ly/planetarium-discord"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-300 hover:text-white mb-1"
            >
              Discord
            </a>
            <a
              href="https://github.com/planetarium"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-300 hover:text-white mb-1"
            >
              Github
            </a>
            <a
              href="https://wiki.nine-chronicles.com/en/9C/FAQ"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-300 hover:text-white mb-1"
            >
              FAQ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
