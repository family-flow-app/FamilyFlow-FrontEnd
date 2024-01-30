// FooterCentered.tsx
// Developed by @yannick-leguennec - GitHub Username

import React from 'react'; // Add this line

import { Group, ActionIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import { IconBrandTwitter, IconBrandInstagram, IconBrandFacebook } from '@tabler/icons-react';
import { useUser } from '../../context/UserInfoContext/UserInfoContext';
import '../../styles/globalStyles.scss';
import classes from './FooterCentered.module.scss';

// Définition du type pour les éléments de lien
type LinkItem = {
  label: string;
  link: string;
};

// Liens à afficher dans le footer
const links: LinkItem[] = [
  { link: '/about', label: 'À propos' },
  { link: '/legals', label: 'Mentions légales' },
  { link: '/terms', label: "Conditions d'utilisation" },
  { link: '/contact', label: 'Contact' },
];

// Composant Footer centré
function FooterCentered() {
  const { user } = useUser();

  const footerClass =
    user.role === 'visitor' ? `${classes.footer} ${classes.visitorFooter}` : classes.footer;

  const breakpointMd = '62em';
  const isDesktop = useMediaQuery(`(min-width: ${breakpointMd} )`);

  // Création des éléments de lien
  const items = links.map((linkItem, index) => {
    const isLastItem = index === links.length - 1;

    return (
      <React.Fragment key={linkItem.label}>
        <Link className={classes.link} to={linkItem.link}>
          {linkItem.label}
        </Link>
        {!isLastItem && isDesktop && (
          <span className={classes.separator} style={{ color: 'white' }}>
            {' '}
            |{' '}
          </span>
        )}
      </React.Fragment>
    );
  });

  return (
    <footer className={`${classes.footer}`}>
      <div className={classes.inner}>
        {/* Affichage des liens */}
        <Group className={classes.links}>{items}</Group>
        {/* Boutons des réseaux sociaux */}
        <Group gap="sm" justify="flex-end" wrap="nowrap">
          <ActionIcon size="md" variant="default" radius="xl" component="a" href="//facebook.com">
            <IconBrandFacebook style={{ width: 18, height: 18 }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="md" variant="default" radius="xl" component="a" href="//instagram.com">
            <IconBrandInstagram style={{ width: 18, height: 18 }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="md" variant="default" radius="xl" component="a" href="//twitter.com">
            <IconBrandTwitter style={{ width: 18, height: 18 }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </footer>
  );
}

export default FooterCentered;
