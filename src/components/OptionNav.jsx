export function OptionNav({ nameClass, children }) {
    return (
        <a className="optionNav">
            <div className={nameClass}>
                {children}
            </div>
        </a>
    )
}

export default OptionNav