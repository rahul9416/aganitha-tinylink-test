"use client";

import { useMemo, useState } from "react";

type LinkItem = {
  code: string;
  url: string;
  clicks: number;
  lastClicked: Date | null;
};

export default function Dashboard() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newCode, setNewCode] = useState("");
  const [query, setQuery] = useState("");

  const filteredLinks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return links;
    return links.filter(
      (l) => l.code.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
    );
  }, [links, query]);

  function addLink() {
    const code = newCode.trim();
    const url = newUrl.trim();
    if (!url || !code) return;
    if (links.some((l) => l.code.toLowerCase() === code.toLowerCase())) return;
    const item: LinkItem = { code, url, clicks: 0, lastClicked: null };
    setLinks((prev) => [item, ...prev]);
    setNewUrl("");
    setNewCode("");
  }

  function deleteLink(code: string) {
    setLinks((prev) => prev.filter((l) => l.code !== code));
  }

  function openLink(code: string) {
    const item = links.find((l) => l.code === code);
    if (!item) return;
    window.open(item.url, "_blank", "noopener,noreferrer");
    setLinks((prev) =>
      prev.map((l) =>
        l.code === code
          ? { ...l, clicks: l.clicks + 1, lastClicked: new Date() }
          : l
      )
    );
  }

  return (
    <div className="flex min-h-[86.5vh] items-center justify-center bg-zinc-200 shadow-xl font-sans dark:bg-black">
      <main className="flex w-full max-w-5xl flex-col items-center py-12 rounded-xl px-6 sm:px-10 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-200 pb-8">Manage links</h1>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <label htmlFor="long-url" className="block text-lg font-semibold text-zinc-800 dark:text-zinc-200 ml-2">Paste a long link url *</label>
            <input
              type="text"
              id="long-url"
              placeholder="Enter a URL"
              required
              className="w-full p-4 border border-zinc-300 rounded-md dark:border-zinc-700"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="alias" className="block text-lg font-semibold text-zinc-800 dark:text-zinc-200 ml-2">Alias (short code)</label>
            <input
              type="text"
              id="alias"
              placeholder="Enter alias"
              required
              className="w-full p-4 border border-zinc-300 rounded-md dark:border-zinc-700"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />
          </div>
          <div className="md:col-span-1">
            <button
              className="w-full cursor-pointer p-4 mt-2 md:mt-0 text-white bg-zinc-800 rounded-md hover:bg-zinc-700 dark:bg-zinc-200 dark:text-black"
              onClick={addLink}
            >
              Add URL
            </button>
          </div>
        </div>

        <div className="w-full mt-8">
          <label htmlFor="search" className="block text-lg font-semibold text-zinc-800 dark:text-zinc-200 ml-2">Search by code or URL</label>
          <input
            type="text"
            id="search"
            placeholder="Search..."
            className="w-full p-4 border border-zinc-300 rounded-md dark:border-zinc-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="w-full mt-8 overflow-x-auto">
          <table className="min-w-full border border-zinc-300 rounded-md overflow-hidden">
            <thead className="bg-zinc-100 dark:bg-zinc-900">
              <tr>
                <th className="text-left p-3 text-zinc-700 dark:text-zinc-300">Short Code</th>
                <th className="text-left p-3 text-zinc-700 dark:text-zinc-300">Target URL</th>
                <th className="text-left p-3 text-zinc-700 dark:text-zinc-300">Total Clicks</th>
                <th className="text-left p-3 text-zinc-700 dark:text-zinc-300">Last Clicked</th>
                <th className="text-left p-3 text-zinc-700 dark:text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.length === 0 ? (
                <tr>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400" colSpan={5}>No links found</td>
                </tr>
              ) : (
                filteredLinks.map((l) => (
                  <tr key={l.code} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td className="p-3 text-zinc-800 dark:text-zinc-200">{l.code}</td>
                    <td className="p-3">
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                        onClick={(e) => {
                          e.preventDefault();
                          openLink(l.code);
                        }}
                      >
                        {l.url}
                      </a>
                    </td>
                    <td className="p-3 text-zinc-800 dark:text-zinc-200">{l.clicks}</td>
                    <td className="p-3 text-zinc-800 dark:text-zinc-200">{l.lastClicked ? l.lastClicked.toLocaleString() : "–"}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 rounded-md bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-zinc-200 dark:text-black"
                          onClick={() => openLink(l.code)}
                        >
                          Open
                        </button>
                        <button
                          className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-500"
                          onClick={() => deleteLink(l.code)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
