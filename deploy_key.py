import pty
import os
import sys
import time

def read(fd):
    return os.read(fd, 1024)

def deploy_key():
    pid, fd = pty.fork()
    
    if pid == 0:
        # Child process
        os.execvp('ssh-copy-id', ['ssh-copy-id', '-o', 'StrictHostKeyChecking=no', 'root@206.189.112.134'])
    else:
        # Parent process
        time.sleep(1)
        output = b""
        while True:
            try:
                chunk = read(fd)
                output += chunk
                if b"password:" in chunk.lower():
                    os.write(fd, b"VitoTechCommunity123q\n")
                    break
            except OSError:
                break
        
        # Wait for finish
        while True:
            try:
                chunk = read(fd)
                output += chunk
                if not chunk:
                    break
            except OSError:
                break
        
        print(output.decode('utf-8', errors='ignore'))
        os.waitpid(pid, 0)

if __name__ == "__main__":
    deploy_key()
