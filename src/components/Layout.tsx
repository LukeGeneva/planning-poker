import type { ReactNode } from 'react';

export type LayoutProps = {
  children: ReactNode;
};

export function Layout(props: LayoutProps) {
  return (
    <html>
      <head>
        <script type="text/javascript" src="/index.js"></script>
      </head>
      <body>{props.children}</body>
    </html>
  );
}
