from pprint import pprint

def read_log_file(filename):
    stats = {
        "view_count": [],
        "visible_view_count": [],
        "ram": [],
        "js_fps": [],
        "ui_fps": [],
        "cpu": []
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
    print(f'max view count: {stats["max_vc"]}, \
        mean view count: {int(stats["mean_vc"])}, \
        max visible view count: {stats["max_vvc"]}, \
        mean visible view count: {int(stats["mean_vvc"])} \
        mean js fps: {int(stats["mean_js_fps"])} \
        mean ui fps: {int(stats["mean_ui_fps"])} \
        max ram: {int(stats["max_ram"])} \
        mean ram: {int(stats["mean_ram"])} \
        max cpu: {int(stats["max_cpu"])} \
        mean cpu: {int(stats["mean_cpu"])}'
    )



if __name__ == '__main__':
    flashlist_stats = read_log_file('./perf_data/log_flashlist.txt')
    flatlist_optim_stats = read_log_file('./perf_data/log_optimize_flatlist.txt')
    flatlist_optim_stats_2 = read_log_file('./perf_data/log_optimize_flatlist_2nd_run.txt')
    flatlist_optim_stats_3 = read_log_file('./perf_data/log_optimize_flatlist_3nd_run.txt')
    prod_stats = read_log_file('./perf_data/log_master.txt')

    flashlist_stats_summary = calculate_stats(flashlist_stats)
    flatlist_optim_stats_summary = calculate_stats(flatlist_optim_stats)
    flatlist_optim_stats_2_summary = calculate_stats(flatlist_optim_stats_2)
    flatlist_optim_stats_3_summary = calculate_stats(flatlist_optim_stats_3)
    prod_stats_summary = calculate_stats(prod_stats)

    print("--------------------")
    print("FlashList stats" + f" - number of measurements: {len(flashlist_stats["view_count"])}")
    print_stats(flashlist_stats_summary)
    print("--------------------")
    print("Flatlist Optimization stats" + f" - number of measurements: {len(flatlist_optim_stats["view_count"])}")
    print_stats(flatlist_optim_stats_summary)
    print("--------------------")
    print("Flatlist Optimization stats run n°2" + f" - number of measurements: {len(flatlist_optim_stats_2["view_count"])}")
    print_stats(flatlist_optim_stats_2_summary)
    print("--------------------")
    print("Flatlist Optimization stats run n°3" + f" - number of measurements: {len(flatlist_optim_stats_3["view_count"])}")
    print_stats(flatlist_optim_stats_3_summary)
    print("--------------------")
    print("Prod stats" + f" - number of measurements: {len(prod_stats["view_count"])}")
    print_stats(prod_stats_summary)
    print("--------------------")