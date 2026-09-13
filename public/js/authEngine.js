// public/js/authEngine.js
// Secure Role-Based Authentication & Session Access Control Engine

window.AUTH_ENGINE = {
  users: [
    {
      username: "candidate@workready.org.au",
      password: "Password123!",
      fullName: "Demonstration Candidate",
      role: "jobseeker",
      roleLabel: "Candidate",
      provider: "Straight Up Training Shell"
    },
    {
      username: "casemanager@workready.org.au",
      password: "Password123!",
      fullName: "Sarah Jenkins",
      role: "case_manager",
      roleLabel: "Case Manager",
      provider: "Straight Up Training Shell"
    },
    {
      username: "business@workready.org.au",
      password: "Password123!",
      fullName: "David Ross (Business Mgr)",
      role: "business_manager",
      roleLabel: "Business Manager",
      provider: "Straight Up Training Shell"
    },
    {
      username: "admin@workready.org.au",
      password: "Password123!",
      fullName: "Master System Admin",
      role: "system_admin",
      roleLabel: "System Administrator",
      provider: "Platform Global"
    }
  ],

  getCurrentUser: function() {
    const sessionData = sessionStorage.getItem('workready_auth_session');
    return sessionData ? JSON.parse(sessionData) : null;
  },

  login: function(username, password) {
    const user = this.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password);

    if (user) {
      const sessionPayload = {
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        roleLabel: user.roleLabel,
        provider: user.provider,
        token: `TOKEN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        loginTime: new Date().toLocaleDateString('en-AU') + " " + new Date().toLocaleTimeString('en-AU')
      };

      sessionStorage.setItem('workready_auth_session', JSON.stringify(sessionPayload));

      if (window.SYSTEM_ADMIN && window.SYSTEM_ADMIN.logSecurityEvent) {
        window.SYSTEM_ADMIN.logSecurityEvent(user.fullName, user.roleLabel, "SECURE_AUTH_LOGIN", `Logged in successfully to ${user.provider}`);
      }

      this.enforceAccessControl();
      return { success: true, user: sessionPayload };
    } else {
      if (window.SYSTEM_ADMIN && window.SYSTEM_ADMIN.logSecurityEvent) {
        window.SYSTEM_ADMIN.logSecurityEvent(username, "Unknown", "AUTH_FAILURE", "Failed login attempt", "DENIED");
      }
      return { success: false, message: "Invalid credentials. Use a quick demo button below or check your password." };
    }
  },

  quickDemoLogin: function(role) {
    const user = this.users.find(u => u.role === role);
    if (user) {
      const uEl = document.getElementById('auth-username');
      const pEl = document.getElementById('auth-password');
      if (uEl) uEl.value = user.username;
      if (pEl) pEl.value = user.password;
      this.login(user.username, user.password);
    }
  },

  handleLoginSubmit: function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const uInput = document.getElementById('auth-username').value;
    const pInput = document.getElementById('auth-password').value;

    const result = this.login(uInput, pInput);
    if (!result.success) {
      const errEl = document.getElementById('auth-error-msg');
      if (errEl) {
        errEl.innerText = result.message;
        errEl.classList.remove('hidden');
      }
    }
  },

  logout: function() {
    const currentUser = this.getCurrentUser();
    if (currentUser && window.SYSTEM_ADMIN && window.SYSTEM_ADMIN.logSecurityEvent) {
      window.SYSTEM_ADMIN.logSecurityEvent(currentUser.fullName, currentUser.roleLabel, "SECURE_AUTH_LOGOUT", "Session terminated cleanly");
    }

    sessionStorage.removeItem('workready_auth_session');
    this.enforceAccessControl();
  },

  enforceAccessControl: function() {
    const user = this.getCurrentUser();
    const authOverlay = document.getElementById('auth-login-overlay');
    const mainApp = document.getElementById('main-app-container');
    const userDisplay = document.getElementById('auth-user-display');
    const roleSwitcher = document.getElementById('role-switcher');

    if (!user) {
      if (authOverlay) authOverlay.classList.remove('hidden');
      if (mainApp) mainApp.classList.add('hidden');
      return;
    }

    if (authOverlay) authOverlay.classList.add('hidden');
    if (mainApp) mainApp.classList.remove('hidden');

    if (userDisplay) {
      userDisplay.innerHTML = `
        <div class="flex items-center gap-2 text-xs">
          <div class="w-8 h-8 rounded-full bg-[#4CAF50] text-white flex items-center justify-center font-bold text-sm shadow">
            ${user.fullName.charAt(0)}
          </div>
          <div>
            <span class="font-bold text-white block leading-tight">${user.fullName}</span>
            <span class="text-[10px] text-slate-300 block">${user.provider} • <strong class="text-[#FFB74D]">${user.roleLabel}</strong></span>
          </div>
          <button onclick="window.AUTH_ENGINE.logout()" class="ml-2 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[11px] transition shadow cursor-pointer">
            🔒 Sign Out
          </button>
        </div>
      `;
    }

    if (roleSwitcher) roleSwitcher.value = user.role;

    if (window.changeActiveRole) {
      window.changeActiveRole(user.role);
    }
  }
};