#ifdef _WIN32
#include <iostream>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <conio.h>
#endif

#ifdef __linux__
#include <iostream>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/sem.h>
#endif

class Artisan
{
public:
#ifdef _WIN32
	DWORD numRead;
	DWORD numToWrite;
#endif
#ifdef __linux__
	int shm_id;
	int sem_id;
#endif
public:
	Artisan() {
#ifdef __linux__
		shm_id = shmget(IPC_PRIVATE, 80, IPC_CREAT | 0666);
		if (shm_id < 0) {
			printf("shmget error\n");
			exit(0);
		}
		system("clear");
		sem_id = semget(IPC_PRIVATE, 2, IPC_CREAT | 0666);
		semctl(sem_id, 0, SETALL, 0);

		if (sem_id < 0) {
			printf("Semaphores is not created.");
			exit(0);
		}
#endif
	}
#ifdef __linux__
	void WaitSemaphore(int sem_id, int num);
	void ReleaseSemaphore(int sem_id, int num);
#endif
#ifdef _WIN32
	void createClientProcess(char*);
	HANDLE createMyPipe();
	HANDLE createPipeFile();
#endif
};

#ifdef __linux__
void Artisan::WaitSemaphore(int sem_id, int num) {
	struct sembuf buf;
	buf.sem_op = -1;
	buf.sem_flg = SEM_UNDO;
	buf.sem_num = num;
	semop(sem_id, &buf, 1);
}
void Artisan::ReleaseSemaphore(int sem_id, int num) {
	struct sembuf buf;
	buf.sem_op = 1;
	buf.sem_flg = SEM_UNDO;
	buf.sem_num = num;
	semop(sem_id, &buf, 1);
}
#endif

#ifdef _WIN32
void Artisan::createClientProcess(char* name)
{
	STARTUPINFO startupInfo;
	PROCESS_INFORMATION processInfo;

	ZeroMemory(&startupInfo, sizeof(startupInfo));
	startupInfo.cb = sizeof(startupInfo);
	ZeroMemory(&processInfo, sizeof(processInfo));

	char commandLine[16] = "-n 1";

	if (!CreateProcess(name,
		commandLine,
		NULL,
		NULL,
		FALSE,
		CREATE_NEW_CONSOLE,
		NULL,
		NULL,
		&startupInfo,
		&processInfo))
	{
		std::cout << "Can't create process. Error " << GetLastError();
	}
}
HANDLE Artisan::createMyPipe()
{
	HANDLE namedPipe = CreateNamedPipe(TEXT("\\\\.\\pipe\\Pipe"),
		PIPE_ACCESS_DUPLEX,
		PIPE_TYPE_MESSAGE | PIPE_READMODE_MESSAGE | PIPE_WAIT,
		PIPE_UNLIMITED_INSTANCES,
		1024, 1024,
		NMPWAIT_USE_DEFAULT_WAIT,
		NULL);

	if (namedPipe == INVALID_HANDLE_VALUE)
	{
		std::cout << "Can't create pipe. Error. Press any key to exit " << GetLastError();
		_getch();
		exit(0);
	}
	return namedPipe;
}
HANDLE Artisan::createPipeFile()
{
	HANDLE namedPipe = CreateFile(TEXT("\\\\.\\pipe\\Pipe"),
		GENERIC_READ | GENERIC_WRITE,
		0,
		NULL,
		OPEN_EXISTING,
		0,
		NULL);

	if (namedPipe == INVALID_HANDLE_VALUE)
	{
		printf("Can't create pipe. Error. Press any key to exit", GetLastError());
		_getch();
		exit(0);
	}
	return namedPipe;
}
#endif
