export type SidebarListType = {
  group: string;
  items: Array<SidebarItemType>;
};

export type SidebarItemType = {
  key: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  parentKey?: string;
  indent?: boolean;
  className?: string;
  activeClassName?: string;
};
