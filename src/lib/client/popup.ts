export function openCenteredPopup(url: string, title: string, inWidth: number, inHeight: number) {
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;

  const left = width / 2 - inWidth / 2 + dualScreenLeft;
  const top = height / 2 - inHeight / 2 + dualScreenTop;

  const popup = window.open(
    url,
    `${title}_${Date.now()}`, // Ensure unique title for each popup
    `width=${inWidth},height=${inHeight},top=${top},left=${left},scrollbars=yes`
  );

  popup?.focus();
}
