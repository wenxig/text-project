import { useUserStore } from '@/store';
import { ceil } from 'lodash-es';

const baseURL = import.meta.env.DEV ? "ws://localhost:8080" : "ws://big-event-vue-api-t.itheima.net:8080"
const user = useUserStore()

export const req = (url: string, msg: Record<any, any>) => {
  return new Promise<string>((resolve, reject) => {
    const baseLength = 1000
    const ws = new WebSocket(`${baseURL}${url}`);
    const valStr = JSON.stringify({ id: user.userInfo.id, body: msg })
    ws.onopen = () => {
      ws.send(JSON.stringify({ path: url }))
      let s = 0
      for (let index = 1; index < ceil(valStr.length / baseLength) + 1; index++) {
        ws.send(valStr.substring(s, index * baseLength))
        s += baseLength;
      }
      ws.send("<--- ws send end --->")
    }
    ws.onmessage = (ev) => { //服务器返回
      const msg: {
        type: boolean,
        msg: any
      } = JSON.parse(ev.data)
      if (msg.type) {
        resolve(msg.msg)
      } else {
        reject(msg.msg)
      }
    }
  })
}