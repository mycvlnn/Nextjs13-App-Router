export interface NavItem {
    title: string
    href?: string
    disabled?: boolean
    external?: boolean
    icon?: any
    label?: string
}

interface DocsConfig {
   sidebarNav: NavItem[]
}

export const docsConfig: DocsConfig = {
   sidebarNav: [
      {
        title: 'Iphone',
        href: '/iphone',
      },
      {
        title: 'Ipad',
        href: '/ipad',
      },
      {
        title: 'Mac',
        href: '/mac',
        },
        {
            title: 'Apple Watch',
            href: '/apple-watch',
          },
      {
         title: 'Blog',
         href: '/blog',
      },
      {
         title: 'Liên hệ',
         href: '/contact',
      },
   ],
}