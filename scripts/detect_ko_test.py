import os
import sys
import json
import subprocess
from time import time


def verify_arguments(): 
	if (len(sys.argv) == 2):
		return True
	else:
		print("Compatible with yarn packager and jest")
		print("Usage: detetect_ko_test <path_to_repo>")
		return False

def get_test_array():
	process = subprocess.Popen('cd ' + sys.argv[1] + ' && yarn jest --listTests --json', shell=True, stdout=subprocess.PIPE)
	process.wait()
	return json.loads(process.stdout.readlines()[2])

def get_test_name(test_path):
	test_path_array = test_path.split('/')
	return test_path_array[-1]

def main():
	if(not(verify_arguments())):
		return
	test_list = get_test_array()
	total_time = 0
	max_duration = 0
	longest_test = ''
	for test in test_list:
		timestmp = time()
		print(get_test_name(test))
		process = subprocess.Popen('cd ' + sys.argv[1] + ' && yarn jest ' + test + ' --detectOpenHandles --runTestsByPath', shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
		process.wait()
		test_time = time() - timestmp
		total_time += test_time
		if(test_time > max_duration):
			max_duration = test_time 
			longest_test = get_test_name(test)
		print('\033[31m' + '---- Time it took to do this test: ', str(test_time) + 's')
		print('\033[39m')
	print('Total time:', str(total_time) + 's')
	print('Max duration is:', str(max_duration) + 's', 'For the test:', longest_test)

main()
