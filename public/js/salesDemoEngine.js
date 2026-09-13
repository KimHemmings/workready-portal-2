// public/js/salesDemoEngine.js
window.SALES_DEMO_ENGINE = (function() {
  let activeContract = 'WORKFORCE';

  const contractConfigs = {
    'WORKFORCE': {
      name: 'Workforce Australia General',
      domain: 'PROV-103',
      pointsTarget: 100,
      hoursTarget: 15,
      roster: [
        { name: 'David Miller', stream: 'Workforce Australia', targetText: '100 Points / Month', status: 'On Track (105 Pts)' },
        { name: 'Rachel Green', stream: 'Workforce Australia', targetText: '100 Points / Month', status: 'At Risk (40 Pts)' }
      ]
    },
    'TTW': {
      name: 'Transition to Work (TtW Youth Specialist)',
      domain: 'PROV-101',
      pointsTarget: 80,
      hoursTarget: 25,
      roster: [
        { name: 'Jordan Lee', stream: 'TtW Youth Specialist', targetText: '80 Points / Month', status: 'On Track (85 Pts)' },
        { name: 'Chloe Bennett', stream: 'TtW Youth Specialist', targetText: '80 Points / Month', status: 'On Track (90 Pts)' }
      ]
    },
    'DES': {
      name: 'Disability Employment Services (DES Inclusive)',
      domain: 'PROV-102',
      pointsTarget: 50,
      hoursTarget: 8,
      roster: [
        { name: 'Taylor Reed', stream: 'DES Flexible Stream', targetText: '50 Points / Month', status: 'On Track (55 Pts)' },
        { name: 'Samuel Harris', stream: 'DES Flexible Stream', targetText: '50 Points / Month', status: 'Review Needed (30 Pts)' }
      ]
    }
  };

  function setSalesDemoContract(contractKey) {
    activeContract = contractKey;
    const config = contractConfigs[contractKey];
    if (!config) return;

    const pointsText = document.getElementById('pbas-points-text');
    if (pointsText) pointsText.innerText = `0 / ${config.pointsTarget} Points`;

    const hoursText = document.getElementById('pbas-hours-text');
    if (hoursText) hoursText.innerText = `0 / ${config.hoursTarget} Hours`;

    const subBranding = document.getElementById('header-sub-branding');
    if (subBranding) subBranding.innerText = `Straight Up Training — ${config.name} Sandbox`;

    const tbody = document.getElementById('cm-roster-table-body');
    if (tbody) {
      tbody.innerHTML = config.roster.map(c => `
        <tr>
          <td class="p-3 font-bold text-[#1D2B53]">${c.name}<span class="block text-[10px] text-slate-500 font-normal">${c.stream}</span></td>
          <td class="p-3"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">${c.status}</span></td>
          <td class="p-3 font-bold text-[#1D2B53]">${c.targetText}</td>
          <td class="p-3 text-slate-600">Active Reporting Cycle</td>
          <td class="p-3"><button class="px-2.5 py-1 bg-[#1D2B53] text-white font-bold rounded hover:bg-slate-800">Inspect Dossier</button></td>
        </tr>
      `).join('');
    }
  }

  function launchSalesDemoBar() {
    let demoBar = document.getElementById('sales-contract-demo-bar');
    if (!demoBar) {
      demoBar = document.createElement('div');
      demoBar.id = 'sales-contract-demo-bar';
      demoBar.className = "bg-gradient-to-r from-sky-900 via-slate-900 to-sky-900 text-white py-3 px-6 border-b-4 border-sky-400 flex flex-wrap justify-between items-center text-xs font-bold gap-3 shadow-2xl";
      demoBar.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 bg-sky-500 text-white rounded-full uppercase tracking-wider font-extrabold shadow">⚡ PROMINENT SALES DEMO CONTROLLER</span>
          <span class="text-sky-200">Switch Contract Stream for Presentation:</span>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="setSalesDemoContract('WORKFORCE')" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-lg transition shadow-md border border-indigo-400">
            🏢 Workforce Australia (100 Pts)
          </button>
          <button onclick="setSalesDemoContract('TTW')" class="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-lg transition shadow-md border border-sky-400">
            👤 TtW Youth (80 Pts)
          </button>
          <button onclick="setSalesDemoContract('DES')" class="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-lg transition shadow-md border border-teal-400">
            📋 DES Flexible (50 Pts)
          </button>
        </div>
      `;
      document.getElementById('main-app-container')?.prepend(demoBar);
    }
  }

  function removeSalesDemoBar() {
    document.getElementById('sales-contract-demo-bar')?.remove();
  }

  return { setSalesDemoContract, launchSalesDemoBar, removeSalesDemoBar };
})();

window.setSalesDemoContract = window.SALES_DEMO_ENGINE.setSalesDemoContract;
window.launchSalesDemoBar = window.SALES_DEMO_ENGINE.launchSalesDemoBar;