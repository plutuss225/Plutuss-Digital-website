import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export function useLocation() {
  const router = useRouter()
  return { pathname: router.asPath.split('?')[0] }
}

export function LinkShim({ to, children, ...props }) {
  return (
    <Link href={to} legacyBehavior>
      <a {...props}>{children}</a>
    </Link>
  )
}

export function NavLink({ to, children, className, end, ...rest }) {
  const router = useRouter()
  const current = router.asPath.split('?')[0]
  const isActive = end ? current === to : current === to || current.startsWith(to)

  let resolvedClass = className
  if (typeof className === 'function') {
    resolvedClass = className({ isActive })
  } else if (className) {
    resolvedClass = `${className}${isActive ? ' active' : ''}`
  } else {
    resolvedClass = isActive ? 'active' : ''
  }

  return (
    <Link href={to} legacyBehavior>
      <a className={resolvedClass} {...rest}>{children}</a>
    </Link>
  )
}

export const Link = LinkShim
export default {
  Link: LinkShim,
  NavLink,
  useLocation,
}
