export const endSession = (): void => {
  localStorage.removeItem('workready_session');
  sessionStorage.clear();
};

export const endSessionRaw = endSession;
