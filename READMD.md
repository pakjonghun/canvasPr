그냥 생각없이 인강 보고 따라한다 막히면 DOC 보고 해결하면서 하고 있음.

## Math.atan2(a,b)

- 라디안을 구해줌
- 인자(a: y 거리차이,b : x 거리차이 )
  - 거리는 현 위치 기준이다.
    - 중앙에서 구석으로 가려면 구석 - 중앙
    - 구석에서 중앙으로 오려면 중앙 - 구석
    -

## canvas.arc(x,y,radius,start,end,option)

- 캔버스에 원을 그려줌
- 인자(x:x좌표, y:y,좌표, radius:반지름, start:원시작, end:원 종료, option:이건 모르겠다..)
  ```
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  ```

## 라디안 _ cos = 그 방향 y 좌표, 가디안 _ sin = 그 방향 x 좌표

```
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
```
