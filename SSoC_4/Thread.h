#ifdef _WIN32
#include <iostream>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <conio.h>
#endif

#ifdef linux
#include <iostream>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <curses.h>
#include <errno.h>
#include <unistd.h>
#include <pthread.h>
#include <sys/types.h>
#include <sys/wait.h>
#endif

static const char* strings[] = { "1.First\n\r", "2.Second\n\r", "3.Third\n\r",
"4.Fourth\n\r", "5.Fifth\n\r", "6.Sixth\n\r", "7.Seventh\n\r", "8.Eighth\n\r",
"9.Ninth\n\r", "10.Tenth\n\r" };

using namespace std;

#ifdef _WIN32
DWORD WINAPI print(void*);
CRITICAL_SECTION sectionForExecute;
#elif __linux__
void* print(void*);
pthread_mutex_t* executeMutex = new pthread_mutex_t();
#endif

class MyThread
{
#ifdef _WIN32
	HANDLE threadHandle;
#elif __linux__
	pthread_t* thread = new pthread_t();
#endif
	int printFlag;
	int closeFlag;
public:
	MyThread(int);
	int threadIndex;
	void startPrint();
	void endPrint();
	bool canPrint();
	bool isWaitingForPrint();
	void closeThread();
	bool isClose();
};

MyThread::MyThread(int number)
{
	threadIndex = number;

	int printFlag = 0;
	int closeFlag = 0;

	if (number == 1)
	{
#ifdef _WIN32
		InitializeCriticalSection(&sectionForExecute);
#elif __linux__
		pthread_mutex_init(executeMutex, NULL);
#endif	
	}
#ifdef _WIN32
	threadHandle = CreateThread(NULL, 100, print, (void*)this, 0, 0);
#elif __linux__
	pthread_create(thread, NULL, print, (void*)this);
#endif
	
}

void MyThread::startPrint()
{
	printFlag = 1;
}

void MyThread::endPrint()
{
	printFlag = 0;
#ifdef _WIN32
	LeaveCriticalSection(&sectionForExecute);
#elif __linux__
	pthread_mutex_unlock(executeMutex);
#endif	
}

bool MyThread::canPrint()
{
	if (
#ifdef _WIN32
		TryEnterCriticalSection(&sectionForExecute) == 0
#elif __linux__
		pthread_mutex_trylock(executeMutex) != 0
#endif	
		)
		return false;
#ifdef _WIN32
	LeaveCriticalSection(&sectionForExecute);
#elif __linux__
	pthread_mutex_unlock(executeMutex);
#endif	
	
	return true;
}

bool MyThread::isWaitingForPrint()
{
	if (printFlag == 1)
		return false;

	printFlag = 0;
	return true;
}

void MyThread::closeThread()
{
	closeFlag = 1;
}

bool MyThread::isClose()
{
	if (closeFlag == 1)
		return true;

	closeFlag = 0;
	return false;
}

#ifdef _WIN32
DWORD WINAPI
#elif __linux__
void*
#endif
print(void* threadName)
{
	MyThread *thread = (MyThread*)threadName;

	while (true)
	{
		if (!(thread->isWaitingForPrint()))
		{
#ifdef _WIN32
			EnterCriticalSection(&sectionForExecute);
#elif __linux__
			pthread_mutex_lock(executeMutex);
#endif
			for (int i = 0; i < strlen(strings[thread->threadIndex - 1]); i++)
			{
				cout << strings[thread->threadIndex - 1][i];
#ifdef _WIN32
				Sleep(50);
#elif __linux__
				usleep(50000);
				fflush(stdout);
				refresh();
#endif
			}
			thread->endPrint();
		}
		else {
#ifdef _WIN32
			Sleep(1);
#elif __linux__
			usleep(1000);
			fflush(stdout);
			refresh();
#endif
		}

		if (thread->isClose()) {
			break;
		}
	}
	return 0;
}

#ifdef _WIN32
int getch_noblock()
{
	if (_kbhit())
		return _getch();
	else
		return -1;
}
#endif