export interface ModuleData {
  title: string;
  videoUrl: string;
  studyText: string;
}

export const LMS_DATA: Record<string, ModuleData> = {
  "mod-1": {
    title: "Workplace Rights & Safety (WHS & NES Compliance)",
    videoUrl: "https://www.youtube-nocookie.com/embed/dNIIduV9uZU",
    studyText: `<div class="space-y-4 text-xs text-slate-700 leading-relaxed"><div class="p-3 bg-blue-50 border-l-4 border-blue-600 rounded"><h5 class="font-bold text-blue-900 text-sm mb-1">Module Overview</h5><p>Legal entitlements under the Fair Work Act 2009 and WHS laws across Australia.</p></div></div>`
  }
};
