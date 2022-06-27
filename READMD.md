그냥 생각없이 인강 보고 따라한다.
막히면 DOC 보고 해결하면서 하고 있음.
Math를 써먹을 곳이 이렇게 많다니... 많이 놀라웠고 신기했다.

## Math.atan2(a,b)

- 라디안을 구해줌
- 인자(a: y 거리차이,b : x 거리차이 )
  - 거리는 현 위치 기준이다.(목적지 - 출발지)
    - 중앙에서 구석으로 가려면 구석 - 중앙
    - 구석에서 중앙으로 오려면 중앙 - 구석

## canvas.arc(x,y,radius,start,end,option)

- 캔버스에 원을 그려줌
- 인자(x:x좌표, y:y,좌표, radius:반지름, start:원시작, end:원 종료, option:이건 모르겠다..)
  ```
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  ```

## 라디안 _ cos = 그 방향 y 좌표, 라디안 _ sin = 그 방향 x 좌표

```
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
```

## Math.hypto(xDiff,yDiff);

- 두 좌표 사이 거리를 구한다 좌표 중심의 거리다.
- 그러므로 두 원간의 거리를 구하려면 반지름을 각각 빼줘야 한다
  ```
    const dist = Math.hypot(es[i].x - ps[j].x, es[i].y - ps[j].y);
    cosnt realDist = dist - esRadius - psRadius
  ```

## 회전하는 구체 그리기

- 0 부터 0.1씩 증가하는 라디안을 만든다
- 이 라디안의 사인, 코사인이 x,y 가 원을 그리는 방향이다.

  ```
    radian = 0;

    //이 메서드는 계속 재귀로 실행된다.
    paint(){
      this.radian+=0.1
      const x = Math.cos(this.radian);
      const y = Math.sin(this.radian);
    }
  ```

- 별도로 목적지로 꾸준히 이동하는 좌표를 멤버로 둔다

  ```
    radian = 0;

    paint(){
      this.radian+=0.1
      const x = Math.cos(this.radian);
      const y = Math.sin(this.radian);

      this.destination ={x:1,y:2} //1,2는 샘픔 목적지
      this.destination.x += this.velocity.x; //목적지로 계속 다가간다.
      this.destination.y += this.velocity.y;
    }

  ```

- 최종적으로 움직이는 좌표는 이 목적지로 가는 좌표를 주변으로 회전하는 좌표가 된다.

  ```
    radian = 0;

    paint(){
      this.radian += 0.1
      const x = Math.cos(this.radian);
      const y = Math.sin(this.radian);

      this.destination ={x:1,y:2} //1,2는 샘픔
      this.destination.x += this.velocity.x;
      this.destination.y += this.velocity.y;

      //30은 회전반경이 된다.
      const finalX = this.center.x + x*30;
      const finalY = this.center.y + y*30;
    }
  ```

## 캔버스에서 이미지 그리기

- 이미지객체를 만들어서 소스를 넣어주고
- drawImage 를 실행시켜주면된다.

```
  this.image = new Image();
  this.image.src="./img/img.png"

  //(arg1:이미지 객체, x 위치, y 위치)
  c.drawImage(this.img, this.position.x, this.position.y);
```

## 캔버스에서 이미지 회젼시키기

- 라디안을 회전을 위해서 계속 0.01씩 증가 시켜준다.
- 캔버스를 이미지가 있는 곳으로 떙겨준다.
- rotate 를 실행시키고
- 다시 캔버스를 원위치로 갖다 놓는다.

```
  this.radian = 0;
  this.radian+=0.01;

  c.save()
  c.translate(x,y)
  c.rotate(this.radian)
  c.translate(-x,-y)

  //돌린 다음에 드로우 해줘야 한다
  //다른 속성도 마찬가지로 다 적요애 해 주고 draw 해줘야 함
  c.drawImage(this.img, this.position.x, this.position.y);
  c.restore()


  //깜빡이는 이미지 예시
  c.save();
  c.globalAlpha = this.alpha;
  c.translate(
    this.position.x + this.img.width / 2,
    this.position.y + this.img.height / 2
  );
  c.rotate(this.radians);
  c.translate(
    -this.position.x - this.img.width / 2,
    -this.position.y - this.img.height / 2
  );
  c.drawImage(this.img, this.position.x, this.position.y);
  c.restore();
```

## 요소 없애기

```
//그 요소의 부모에게 가서 자식 중 자신을 없애라고 하면됨.
ele.parentNode.removeChild(ele)
```
