function LetterBox({
  char,
  type,
  colorClass = "light-grey",
  handleClick,
  addClassName,
  disabled,
}) {
  if (type === "tile") {
    return <div className={`letterbox ${colorClass} tile`}>{char}</div>;
  } else if (type === "key") {
    return (
      <button
        disabled={disabled}
        className={`letterbox ${colorClass} key-button ${addClassName}`}
        onClick={handleClick}
        value={char}
      >
        {char}
      </button>
    );
  }
}

export default LetterBox;
