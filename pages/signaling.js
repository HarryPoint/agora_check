import {SignalingClient} from '@/utils';
const APP_ID = false
  ? 'daa941a27c5b460db25dea0e30a538e2'
  : '4f34c247f5bc4ac094c287b5a3a5aded';
import {useEffect} from 'react'
export default () => {
    // 信令实例
    let signal = null;
    useEffect(() => {
        // 初始化信令
        signal = new SignalingClient(APP_ID, '');
    }, []);
    return (<div>sdfsdf</div>)
}