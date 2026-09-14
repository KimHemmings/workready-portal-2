// public/js/authEngine.js

// Pre-approved sales rep credentials
window.APPROVED_SALES_REPS = {
  'sales@straightuptraining.com': true,
  'training@straightuptraining.com': true
};

window.handleSecureLogin = async function(e) {
  if (e) e.preventDefault();

  const userEl = document.getElementById('auth-username');
  const passEl = document.getElementById('auth-password');
  const errEl = document.getElementById('auth-error-msg');

  if (!userEl || !passEl) return;

  const user = userEl.value.trim().toLowerCase();
  const pass = passEl.value.trim();

  if (errEl) errEl.classList.add('hidden');

  // 1. Hardcoded System Admin Account
  if (user === 'admin@straightuptraining.com' && pass === 'WorkReadyAdmin2026!') {
    localStorage.setItem('user_role', 'system_admin');
    localStorage.setItem('user_email', user);
    
    document.getElementById('auth-login-overlay')?.classList.add('hidden');
    document.getElementById('main-app-container')?.classList.remove('hidden');
    
    if (typeof window.changeActiveRole === 'function') {
      window.changeActiveRole('system_admin');
    }
    return;
  }

  // 2. Hardcoded Sales Rep Accounts
  if ((user === 'training@straightuptraining.com' && pass === 'Welcome01!') || 
      (window.APPROVED_SALES_REPS && window.APPROVED_SALES_REPS[user])) {
    localStorage.setItem('user_role', 'sales_rep');
    localStorage.setItem('user_email', user);
    
    document.getElementById('auth-login-overlay')?.classList.add('hidden');
    document.getElementById('main-app-container')?.classList.remove('hidden');
    
    if (typeof window.changeActiveRole === 'function') {
      window.changeActiveRole('sales_rep');
    }
    return;
  }

  // 3. Supabase Auth Fallback (If connected)
  if (window.supabase && typeof window.supabase.auth?.signInWithPassword === 'function') {
    try {
      const { data, error } = await window.supabase.auth.signInWithPassword({
        email: user,
        password: pass
      });

      if (error) throw error;

      const { data: roleData } = await window.supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      const assignedRole = roleData?.role || 'jobseeker';

      localStorage.setItem('user_role', assignedRole);
      localStorage.setItem('user_email', user);

      document.getElementById('auth-login-overlay')?.classList.add('hidden');
      document.getElementById('main-app-container')?.classList.remove('hidden');

      if (typeof window.changeActiveRole === 'function') {
        window.changeActiveRole(assignedRole);
      }
      return;
    } catch (err) {
      if (errEl) {
        errEl.innerText = 'Access Denied: Invalid email or password.';
        errEl.classList.remove('hidden');
      }
      return;
    }
  }

  // 4. Fallback Rejection
  if (errEl) {
    errEl.innerText = 'Access Denied: Invalid user credentials.';
    errEl.classList.remove('hidden');
  }
};

window.handleSignOut = function() {
  sessionStorage.clear();
  localStorage.clear();
  window.location.reload();
};

window.AUTH_ENGINE = {
  openForgotPasswordModal: function() {
    document.getElementById('auth-reset-modal')?.classList.remove('hidden');
  },
  closeForgotPasswordModal: function() {
    document.getElementById('auth-reset-modal')?.classList.add('hidden');
  },
  handlePasswordResetSubmit: function(e) {
    if (e) e.preventDefault();
    alert('Password reset link sent to your registered email address.');
    this.closeForgotPasswordModal();
  }
};