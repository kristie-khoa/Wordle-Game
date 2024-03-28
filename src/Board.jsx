import Row from "./Row";

function Board({
  arrayOfStringObjects,
  boardType,
  handleClick,
  handleDelete,
  handleSubmit,
  disabled,
}) {
  //given an array of objects, and for each guess object, make a row of that guess and pass the guess and color
  let board = arrayOfStringObjects.map((stringObject, index) => {
    // each stringObject looks like {guess:"peace", color: ["green", "green", "yellow", "dark-grey", "dark grey"]}
    return (
      <Row
        disabled={disabled}
        stringObject={stringObject}
        handleClick={handleClick}
        handleDelete={handleDelete}
        handleSubmit={handleSubmit}
        boardType={boardType}
        isLastRowKeyBoard={
          index === 2 && boardType === "keyBoard" ? true : false
        }
      />
    );
  });

  return <div>{board}</div>;
}

export default Board;
