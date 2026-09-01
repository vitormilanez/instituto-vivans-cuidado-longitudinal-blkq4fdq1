import React, { useState, useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export interface VivansAvatarProps {
  src?: string | null
  alt?: string
  name?: string
  initials?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  fallbackClassName?: string
  borderClassName?: string
}

const sizeClasses = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-xs sm:text-sm',
  lg: 'size-12 text-sm sm:text-base',
  xl: 'size-16 text-lg sm:text-xl',
  '2xl': 'size-20 sm:size-24 text-xl sm:text-2xl',
}

export function VivansAvatar({
  src,
  alt,
  name,
  initials,
  size = 'md',
  className,
  fallbackClassName,
  borderClassName = 'border border-[#E8E3D9]',
}: VivansAvatarProps) {
  const [hasError, setHasError] = useState(false)

  // Reset error state if src changes
  useEffect(() => {
    setHasError(false)
  }, [src])

  const sizeClass = sizeClasses[size] || sizeClasses.md

  // Safe fallback calculation for initials
  const computedInitials =
    initials ||
    (name
      ? name
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((n) => n[0].toUpperCase())
          .join('')
      : 'IV')

  const computedAlt =
    alt || (name ? `Retrato de ${name}` : undefined) || `Avatar ${computedInitials}`

  return (
    <Avatar
      className={cn(
        sizeClass,
        borderClassName,
        'relative shrink-0 select-none shadow-subtle bg-[#F1EEE7] overflow-hidden',
        className,
      )}
    >
      {src && !hasError ? (
        <AvatarImage
          src={src}
          alt={computedAlt}
          onError={() => setHasError(true)}
          className="aspect-square size-full object-cover"
          loading="lazy"
        />
      ) : null}
      <AvatarFallback
        className={cn(
          'flex size-full items-center justify-center font-bold tracking-tight bg-[#E7EFEA] text-[#2E5E4E] border border-[#C3D6CC]',
          fallbackClassName,
        )}
      >
        {computedInitials}
      </AvatarFallback>
    </Avatar>
  )
}
