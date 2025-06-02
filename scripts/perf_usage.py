import datetime

def read_log_file(filename):
    stats = {
        "view_count": [],
        "visible_view_count": [],
        "ram": [],
        "js_fps": [],
        "ui_fps": [],
        "cpu": [],
        "time": []
    }
    with open(file=filename, mode='r') as fic:
        for line in fic:
            if "viewCount" in line:
                val = line.split(':')[1].split(',')[0].strip(' ')
                stats["view_count"].append(int(val))
            if "visibleViewCount" in line:
                val = line.split(':')[1].split(',')[0].strip(' ')
                stats["visible_view_count"].append(int(val))
            if "jsFps" in line:
                val = line.split(':')[1].split(',')[0].strip(' ')
                stats["js_fps"].append(int(val))
            if "uiFps" in line:
                val = line.split(':')[1].split(',')[0].strip(' ')
                stats["ui_fps"].append(int(val))
            if "usedRam" in line:
                val = line.split(':')[1].split(',')[0].strip(' ')
                stats["ram"].append(float(val))
            if "usedCpu" in line:
                val = line.split(':')[1].split(',')[0].strip(' ')
                stats["cpu"].append(float(val))
            if "DEBUG" in line:
                val = line.split('|')[0].strip(' ')
                stats["time"].append(datetime.datetime.strptime(val, "%H:%M:%S"))

    return stats

def calculate_stats(stats):
    return {
        "max_vc": max(stats["view_count"]),
        "mean_vc": sum(stats["view_count"])/len(stats["view_count"]),
        "max_vvc": max(stats["visible_view_count"]),
        "mean_vvc": sum(stats["visible_view_count"])/len(stats["visible_view_count"]),
        "mean_js_fps": sum(stats["js_fps"])/len(stats["js_fps"]),
        "mean_ui_fps": sum(stats["ui_fps"])/len(stats["ui_fps"]),
        "max_ram":  max(stats["ram"]),
        "mean_ram": sum(stats["ram"])/len(stats["ram"]),
        "max_cpu":  max(stats["cpu"]),
        "mean_cpu": sum(stats["cpu"])/len(stats["cpu"]),
    }

def print_stats(stats):
    print(f'max view count: {stats["max_vc"]}\t'
        f'mean view count: {int(stats["mean_vc"])}\t' +
        f'max visible view count: {stats["max_vvc"]}\t' +
        f'mean visible view count: {int(stats["mean_vvc"])}\t' +
        f'mean js fps: {int(stats["mean_js_fps"])}\t' +
        f'mean ui fps: {int(stats["mean_ui_fps"])}\t' +
        f'max ram: {int(stats["max_ram"])}\t' +
        f'mean ram: {int(stats["mean_ram"])}\t' +
        f'max cpu: {int(stats["max_cpu"])}\t' +
        f'mean cpu: {int(stats["mean_cpu"])}'
    )

def pprint_results(stats, stats_summary, name):
    print("--------------------")
    print(f"{name} - number of measurements: {len(stats["view_count"])} - total time: {(stats["time"][-1] - stats["time"][0]).total_seconds()}")
    print_stats(stats_summary)
    print("--------------------")

if __name__ == '__main__':
    stats = [read_log_file('./perf_data/log.txt'), 
             read_log_file('./perf_data/log_2nd_run.txt'), 
             read_log_file('./perf_data/log_3nd_run.txt')
            ]

    stats_summary = [calculate_stats(stats) for stats in stats]

    for i in range(len(stats)):
        pprint_results(stats[i], stats_summary[i], f"Stats run n°{i+1}")