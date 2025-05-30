from pprint import pprint

def read_log_file(filename):
    stats = {
        "view_count": [],
        "visible_view_count": []
    }
    with open(file=filename, mode='r') as fic:
        for line in fic:
            if "viewCount" in line:
                val = line.split(':')[1].split(',')[0].strip(' ')
                stats["view_count"].append(int(val))
            if "visibleViewCount" in line:
                val = line.split(':')[1].split(',')[0].strip(' ')
                stats["visible_view_count"].append(int(val))
    return stats

def calculate_stats(stats):
    max_vc = max(stats["view_count"])
    max_vvc = max(stats["visible_view_count"])
    mean_vc = sum(stats["view_count"])/len(stats["view_count"])
    mean_vvc = sum(stats["visible_view_count"])/len(stats["visible_view_count"])


    return {"max_vc": max_vc, "mean_vc": mean_vc, "max_vvc": max_vvc, "mean_vvc": mean_vvc}


if __name__ == '__main__':
    flashlist_stats = read_log_file('/Users/passculture/Documents/log_flashlist.txt')
    prod_stats = read_log_file('/Users/passculture/Documents/log_master.txt')

    flashlist_stats_summary = calculate_stats(flashlist_stats)
    prod_stats_summary = calculate_stats(prod_stats)

    print("--------------------")
    print("FlashList stats")
    print(f'max view count: {flashlist_stats_summary["max_vc"]}, mean view count: {int(flashlist_stats_summary["mean_vc"])}, max visibile view count: {flashlist_stats_summary["max_vvc"]}, mean visibile view count: {int(flashlist_stats_summary["mean_vvc"])}')
    print("--------------------")
    print("Prod stats")
    print(f'max view count: {prod_stats_summary["max_vc"]}, mean view count: {int(prod_stats_summary["mean_vc"])}, max visibile view count: {prod_stats_summary["max_vvc"]}, mean visibile view count: {int(prod_stats_summary["mean_vvc"])}')
    print("--------------------")