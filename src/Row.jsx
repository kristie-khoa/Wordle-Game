import LetterBox from "./LetterBox";

function Row({
  stringObject,
  boardType = "gameBoard",
  isLastRowKeyBoard,
  handleClick,
  handleSubmit,
  handleDelete,
  disabled,
}) {
  //given object with array of string and array of colors
  let arrOfChars = [...stringObject.string];

  // arrOfChars = [delete,s,t,a,r,e, submit]

  if (isLastRowKeyBoard) {
    arrOfChars.unshift("delete");
    arrOfChars.push("submit");
  }

  let row = arrOfChars.map((char, index) => {
    return (
      <LetterBox
        addClassName={
          char === "submit" ? "submit" : char === "delete" ? "delete" : ""
        }
        char={char}
        disabled={disabled}
        colorClass={stringObject.colors[index]}
        type={boardType === "gameBoard" ? "tile" : "key"}
        handleClick={
          char === "submit"
            ? handleSubmit
            : char === "delete"
            ? handleDelete
            : handleClick
        }
      />
    );
  });

  return <div className="row">{row}</div>;
}

export default Row;
