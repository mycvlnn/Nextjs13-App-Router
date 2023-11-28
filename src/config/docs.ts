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
        href: '/category/iphone',
      },
      {
        title: 'Ipad',
        href: '/category/ipad',
      },
      {
        title: 'Mac',
        href: '/category/mac',
        },
        {
            title: 'Apple Watch',
            href: '/category/apple-watch',
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