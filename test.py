import tkinter as tk
import os

def create_file(ext, type_name):
    filename = entry_filename.get().strip()
    if not filename:
        status_label.config(text="なまえがない！", fg="#FF5555")
        return
    
    if not filename.endswith(ext):
        filename = filename + ext
    
    desktop = r"C:\Users\user\OneDrive\Desktop"
    if not os.path.exists(desktop):
        desktop = os.path.expanduser(r"~\Desktop")
        
    filepath = os.path.join(desktop, filename)
    
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            if ext == ".html":
                f.write("<!DOCTYPE html>\n<html lang=\"ja\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Doc</title>\n</head>\n<body>\n</body>\n</html>")
            else:
                f.write("")
        status_label.config(text=f"できた！", fg="#55FF55")
        entry_filename.delete(0, tk.END)
    except Exception as e:
        status_label.config(text="エラー！", fg="#FF5555")

BG_COLOR = "#000000"
FG_COLOR = "#FFFFFF"
BORDER_COLOR = "#FFFFFF"

root = tk.Tk()
root.title("作成")
# 縦横約1/3サイズを目指して極力小さく
root.geometry("160x180")
root.resizable(False, False)
root.configure(bg=BG_COLOR)

FONT_MAIN = ("MS Gothic", 9)
FONT_BTN = ("MS Gothic", 8)

main_frame = tk.Frame(root, bg=BG_COLOR, highlightbackground=BORDER_COLOR, highlightthickness=2, bd=0)
main_frame.pack(fill=tk.BOTH, expand=True, padx=2, pady=2)

# 入力エリア
entry_frame = tk.Frame(main_frame, bg=BG_COLOR, highlightbackground=BORDER_COLOR, highlightthickness=1)
entry_frame.pack(fill=tk.X, padx=4, pady=(8, 4))

entry_filename = tk.Entry(
    entry_frame, 
    font=FONT_MAIN,
    bg=BG_COLOR,
    fg=FG_COLOR,
    relief=tk.FLAT,
    insertbackground=FG_COLOR,
    bd=2,
    width=10
)
entry_filename.pack(fill=tk.X)
entry_filename.insert(0, "なまえ")
# クリックでプレースホルダーを消す
def on_click(event):
    if entry_filename.get() == "なまえ":
        entry_filename.delete(0, tk.END)
entry_filename.bind("<Button-1>", on_click)

# ボタンフレーム
buttons_frame = tk.Frame(main_frame, bg=BG_COLOR)
buttons_frame.pack(fill=tk.BOTH, expand=True, padx=4, pady=2)

file_types = [
    ("TXT", ".txt", "#FFFFFF"),
    ("HTM", ".html", "#FF5555"),
    ("CSS", ".css", "#55AAFF"),
    ("JS", ".js", "#FFFF55"),
    ("Py", ".py", "#55FF55"),
    ("JSN", ".json", "#FF55FF"),
    ("MD", ".md", "#55FFFF"),
    ("CSV", ".csv", "#AAAAAA")
]

for i, (name, ext, color) in enumerate(file_types):
    row = i // 4
    col = i % 4
    
    btn_border = tk.Frame(buttons_frame, bg=BORDER_COLOR, bd=0)
    btn_border.grid(row=row, column=col, padx=1, pady=1, sticky="nsew")
    
    btn = tk.Button(
        btn_border, 
        text=name, 
        font=FONT_BTN,
        bg=BG_COLOR,
        fg=FG_COLOR,
        activebackground=FG_COLOR,
        activeforeground=BG_COLOR,
        relief=tk.FLAT,
        bd=0,
        padx=0,
        pady=2,
        cursor="hand2",
        command=lambda e=ext, n=name: create_file(e, n)
    )
    btn.pack(padx=1, pady=1, fill=tk.BOTH, expand=True)
    
    def make_hover_funcs(b, c):
        def on_enter(e):
            b.config(bg=c, fg=BG_COLOR)
        def on_leave(e):
            b.config(bg=BG_COLOR, fg=FG_COLOR)
        return on_enter, on_leave

    on_enter, on_leave = make_hover_funcs(btn, color)
    btn.bind("<Enter>", on_enter)
    btn.bind("<Leave>", on_leave)

for i in range(4):
    buttons_frame.grid_columnconfigure(i, weight=1)
for i in range(2):
    buttons_frame.grid_rowconfigure(i, weight=1)

# ステータス
status_label = tk.Label(
    main_frame, 
    text="ファイルをつくる！", 
    font=FONT_MAIN,
    bg=BG_COLOR,
    fg=FG_COLOR
)
status_label.pack(pady=(2, 6))

root.mainloop()
