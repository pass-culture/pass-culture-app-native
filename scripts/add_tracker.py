import getopt
import re
import sys
from pathlib import Path


def pascal_case_to_constant_case(name):
    return re.sub(r'(?<!^)(?=[A-Z])', '_', name).upper()


def pascal_case_to_snake_case(name):
    return re.sub(r'(?<!^)(?=[A-Z])', '_', name).lower()


def is_pascal_case(name):
    return bool(re.match(r'([A-Z][a-z0-9]+)+', name))


def usage():
    print("""Usage: python scripts/add_tracker.py [-h] [-p <provider>] <tracker_name>
          
-h, --help: Show this message
-p, --provider: is one of: firebase, amplitude. Default: firebase
<tracker_name>: Name of the tracker to add. Must be PascalCase.""")


def parse_command_line():
    options, args = getopt.getopt(sys.argv[1:], "hp:", ["help","provider="])
    provider = "firebase"

    for option, value in options:
        if option in ("-p", "--provider"):
            if value not in PROVIDERS.keys():
                usage()
                sys.exit(1)
            provider = value
        elif option in ("-h", "--help"):
            usage()
            sys.exit(0)

    if not is_pascal_case(args[0]):
        usage()
        sys.exit(1)

    tracker_name = args[0]  # PascalCase
    return provider, tracker_name


def insert_line(file, to_insert, prefix):
    with open(file, "r") as fd:
        lines = fd.readlines()

    line_number = 0
    for i, line in enumerate(lines):
        if (prefix and line.startswith(prefix) or not prefix) and line > to_insert:
            line_number = i
            break

    new_file_lines = lines[:line_number] + [to_insert] + lines[line_number:]
    with open(file, "w") as fd:
        fd.writelines(new_file_lines)

        
FILENAME = "logEventAnalytics.ts"

PROVIDERS = {
    "firebase": {
        "prefix":"AnalyticsEvent",
        "event_name_formatter": lambda name: name
    },
    "amplitude": {
        "prefix":"AmplitudeEvent",
        "event_name_formatter": pascal_case_to_snake_case
    }
}

provider, tracker_name = parse_command_line()
event_enum_name = pascal_case_to_constant_case(tracker_name)
provider_prefix = PROVIDERS[provider]["prefix"]
root_path = Path(__file__).parent.parent
code_folder = root_path / "src/libs/analytics"
mock_folder = code_folder / "__mocks__"

event_file = (
    root_path
    / f"src/libs/{provider}/{'analytics/' if provider == 'firebase' else ''}events.ts"
)

to_insert_code = (
    f"  log{tracker_name}: () => analytics.logEvent({{ {provider}: {provider_prefix}.{event_enum_name} }}),\n"
)
to_insert_mock = f"  log{tracker_name}: jest.fn(),\n"
to_insert_event = f"  {event_enum_name} = '{PROVIDERS[provider]['event_name_formatter'](tracker_name)}',\n"

insert_line(code_folder / FILENAME, to_insert_code, "  log")
insert_line(mock_folder / FILENAME, to_insert_mock, "  log")
insert_line(event_file, to_insert_event, "  ")
