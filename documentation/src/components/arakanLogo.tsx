import { useColorMode } from '@docusaurus/theme-common';

export const ArakanLogo = (props: { className?: string }) => {
  const { colorMode } = useColorMode();
  
  const logoSrc = colorMode === 'dark' 
    ? 'img/arakan-logo-white.png' 
    : 'img/arakan-logo-black.png';
  
  const logoAlt = 'arakan logo';

  return (
    <img
      src={logoSrc}
      alt={logoAlt}
      className={props.className}
      style={{ height: 'auto', maxWidth: '100%' }}
    />
  );
};
