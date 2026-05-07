interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
}

function Button({ children, variant, ...rest }: ButtonProps) {
  const colors = {
    primary: '#007bff',
    secondary: '#4d854f',
    danger: '#9a3a44',
  }
  const backgroundColor = colors[variant as keyof typeof colors]
  return (
    <button
      {...rest}
      style={{ '--btn-color': backgroundColor } as React.CSSProperties}
      className={`
        bg-[rgb(from_var(--btn-color)_r_g_b_/_100%)] 
        hover:bg-[rgb(from_var(--btn-color)_r_g_b_/_85%)] 
        text-white font-bold py-2 px-6 rounded-full cursor-pointer
      `}
    >
      {children}
    </button>
  )
}

export default Button
