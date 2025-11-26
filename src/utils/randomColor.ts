
export function randomColor(): string {

  let hexValues:string = "0123456789ABCDEF";
  let color:string = '#';
  
  for(let i = 0; i < 6; i++){
    color += hexValues[(Math.floor(Math.random() * 16))]
  }
  return color;
}
