import os

def extract_first_heading(md_file):
    """Extracts the first heading from a markdown file."""
    with open(md_file, 'r', encoding='utf-8') as file:
        for line in file:
            if line.startswith('# '):
                return line.strip()[2:]  # Remove '# ' and return the heading
    return "No Title Found"

def generate_toc(doc_directory, output_filename, base_text):
    toc_dict = {}
    for root, dirs, files in os.walk(doc_directory):
        for file in files:
            if file.endswith(".md"):
                # Calculate relative path from doc_directory and remove the file name
                relative_dir_path = os.path.relpath(root, doc_directory)
                if relative_dir_path not in toc_dict:
                    toc_dict[relative_dir_path] = []
                toc_dict[relative_dir_path].append(file)

    output_path = os.path.join(doc_directory, output_filename)
    with open(output_path, 'w', encoding='utf-8') as toc_file:
        # Write the base text at the top of the README
        toc_file.write(base_text + "\n\n")
        
        for dir_path, files in toc_dict.items():
            # Skip the root doc_directory itself if it contains markdown files
            if dir_path != ".":
                # Convert directory path to title case and replace slashes with space for the title
                dir_title = dir_path.replace(os.path.sep, " ").title()
                toc_file.write(f"## {dir_title}\n")
            for file in files:
                file_path = os.path.join(dir_path, file)
                toc_file.write(f"- [{file}]({file_path})\n")
            toc_file.write("\n")  # Add a newline for better readability

# Configuration
doc_directory = './'  # UPDATE this path to your actual /doc directory
output_filename = 'README.md'
base_text = '# Documentation Index\n\nThis is a placeholder text. Update it as needed.'

# Generate the README.md
generate_toc(doc_directory, output_filename, base_text)

print(f"Table of Contents generated at {os.path.join(doc_directory, output_filename)}")
