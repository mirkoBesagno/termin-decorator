
import os from "os";

export function StartMonitoring() {
    try {

        const used = process.memoryUsage();
        const partizionamentoMemoriaProcesso: {
            rss: string,
            heapTotale: string,
            heapUsed: string,
            external: string,
            cpuMedia: any,
            totalMemo: string,
            freeMemo: string
        } = {
            rss: '',
            heapTotale: '',
            heapUsed: '',
            external: '',
            cpuMedia: '',
            totalMemo: '',
            freeMemo: ''
        };
        // eslint-disable-next-line prefer-const
        for (let key in used) {
            switch (key) {
                case 'rss':
                    partizionamentoMemoriaProcesso.rss = `${key} ${Math.round((<any>used)[key] / 1024 / 1024 * 100) / 100} MB`;
                    break;
                case 'heapTotal':
                    partizionamentoMemoriaProcesso.heapTotale = `${key} ${Math.round((<any>used)[key] / 1024 / 1024 * 100) / 100} MB`;
                    break;
                case 'heapUsed':
                    partizionamentoMemoriaProcesso.heapUsed = `${key} ${Math.round((<any>used)[key] / 1024 / 1024 * 100) / 100} MB`;
                    break;
                case 'external':
                    partizionamentoMemoriaProcesso.external = `${key} ${Math.round((<any>used)[key] / 1024 / 1024 * 100) / 100} MB`;
                    break;
                default:
                    break;
            }
        }
        partizionamentoMemoriaProcesso.cpuMedia = os.cpus();
        partizionamentoMemoriaProcesso.totalMemo = os.totalmem().toString();
        partizionamentoMemoriaProcesso.freeMemo = os.freemem().toString();

        //console.log("Data" + Date.now(), partizionamentoMemoriaProcesso);


        setTimeout(() => {
            StartMonitoring();
        }, (20) * 1000);
    } catch (error) {
        setTimeout(() => {
            StartMonitoring();
        }, (20) * 1000);
    }
}
