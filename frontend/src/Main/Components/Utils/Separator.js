function Separator({ color = "black", height = 1, width }) {
    return (
      <hr
        style={{
          backgroundColor: color,
          height: height,
          width: width,
          border: "none",
          justifyContent: 'center',
          justifyItems: ' center'
        }}
      />
    );
  }

export default Separator;