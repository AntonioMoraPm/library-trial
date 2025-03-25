export interface ClassNameProps {
    className?: string;
}

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & ClassNameProps) {
    return <button {...props} />
}