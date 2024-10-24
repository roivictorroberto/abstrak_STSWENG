document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.getElementById('prev-audit-button');
    const nextButton = document.getElementById('next-audit-button');
    const pageNumber = document.getElementById('audit-page-number');

    const filterModal = document.getElementById('filter-sort-modal-audit');
    const filterBtn = document.getElementById('audit-filter-sort-btn');
    const closeFilterBtn = filterModal.querySelector(".close");
    const doneBtn = document.getElementById('filter-sort-done-audit');
    const clearBtn = document.getElementById('filter-sort-clear-audit');  

    let totalPagesPagination = parseInt(document.getElementById('total-audit-pages').textContent);

    let currentFilters = {
        sort: '',
        paymentMethod: '',
        collection: '',
        category: '',
        startDate: '',
        endDate: ''
    };

    const openFilterModal = () => {
        document.getElementById('sorting-audit').value = currentFilters.sort || '';
        document.getElementById('filter-username').value = currentFilters.paymentMethod || '';
        document.getElementById('filter-username').value = currentFilters.collection || '';
        document.getElementById('start-date-audit').value = currentFilters.startDate || '';
        document.getElementById('end-date-audit').value = currentFilters.endDate || '';
        filterModal.style.display = "block";
    };
    
    const closeFilterModal = () => {
        filterModal.style.display = "none";
        document.getElementById("filter-sort-form-audit").reset();
    };

    filterBtn.addEventListener('click', openFilterModal);
    closeFilterBtn.addEventListener('click', closeFilterModal);

    window.addEventListener('click', (event) => {
        if (event.target === filterModal) {
            closeFilterModal();
        }
    });

    const loadPage = async (page) => {
        try {
            const response = await fetch(`/auditLog?${query}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            const { changes, totalPages } = result;
            const tbody = document.getElementById('audits-list');
            tbody.innerHTML = '';
            document.getElementById('total-audit-pages').textContent = totalPages;
            changes.forEach(audit => {
                const username = audit.username || 'N/A';
                const page = audit.page || 'N/A';
                const dateTime = audit.dateTime || 'N/A';
                const action = audit.action || 'N/A';
                const oldData = audit.oldData || 'N/A';
                const newData = audit.newData || 'N/A';
                const tr = document.createElement('tr');
                tr.classList.add('audits-row');
                tr.innerHTML = `
                    <td>${dateTime}</td>
                    <td>${username}</td>
                    <td>${page}</td>
                    <td>${action}</td>
                    <td>${oldData}</td>
                    <td>${newData}</td>
                `;
                tbody.appendChild(tr);
            });
    
            pageNumber.textContent = page;
            if (totalPages === 0 || totalPages === 1) {
                prevButton.style.display = 'none';
                nextButton.style.display = 'none';
                console.log("hi");
            } else {
                prevButton.style.display = (page === 1) ? 'none' : 'inline';
                nextButton.style.display = (page === totalPages) ? 'none' : 'inline';
                console.log("hi");
            }
        } catch (error) {
            console.error('Error loading page:', error);
        }
    };

    const initialize = () => {
        loadPage(parseInt(pageNumber.textContent));
    };
    
    filterBtn.addEventListener('click', openFilterModal);
    closeFilterBtn.addEventListener('click', closeFilterModal);

    nextButton.addEventListener('click', () => {
        const currentPage = parseInt(pageNumber.textContent);
        if (currentPage < totalPagesPagination) {
            if (isFiltersApplied(currentFilters)) {
                filterResultAudits(currentPage + 1);
            } else {
                loadPage(currentPage + 1);
            }
        }
    });

    prevButton.addEventListener('click', () => {
        const currentPage = parseInt(pageNumber.textContent);
        if (currentPage > 1) {
            if (isFiltersApplied(currentFilters)) {
                filterResultAudits(currentPage - 1);
            } else {
                loadPage(currentPage - 1);
            }
        }
    });

    const filterResult = async (page) => {
        const query = $.param({ ...currentFilters, page });
        try {
            const response = await fetch(`/auditLog?${query}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            const { changes, totalPages } = result;
            const tbody = document.getElementById('audits-list');
            tbody.innerHTML = '';
            document.getElementById('total-audit-pages').textContent = totalPages;
            changes.forEach(audit => {
                const username = audit.username || 'N/A';
                const page = audit.page || 'N/A';
                const dateTime = audit.dateTime || 'N/A';
                const action = audit.action || 'N/A';
                const oldData = audit.oldData || 'N/A';
                const newData = audit.newData || 'N/A';
                const tr = document.createElement('tr');
                tr.classList.add('audits-row');
                tr.innerHTML = `
                    <td>${dateTime}</td>
                    <td>${username}</td>
                    <td>${page}</td>
                    <td>${action}</td>
                    <td>${oldData}</td>
                    <td>${newData}</td>
                `;
                tbody.appendChild(tr);
            });

            pageNumber.textContent = page;
            if (totalPages <= 1) {
                prevButton.style.display = 'none';
                nextButton.style.display = 'none';
            } else {
                if (page === 1) {
                    prevButton.style.display = 'none';
                } else {
                    prevButton.style.display = 'inline';
                }
                if (page === totalPages) {
                    nextButton.style.display = 'none';
                } else {
                    nextButton.style.display = 'inline';
                }
            }
        } catch (error) {
            console.error('Error loading page:', error);
        }
    };

    // Function to check if filters are applied
    const isFiltersApplied = (filters) => {
        return Object.values(filters).some(value => value);
    };

    doneBtn.addEventListener('click', () => {
        currentFilters.sort = document.getElementById('sorting-audit').value;
        currentFilters.username = document.getElementById('filter-payment-method').value;
        currentFilters.page = document.getElementById('filter-collection').va
        currentFilters.startDate = document.getElementById('start-date-audit').value;
        currentFilters.endDate = document.getElementById('end-date-audit').value;
        
        closeFilterModal();
    });
    
    
    clearBtn.addEventListener('click', () => {
        document.getElementById('filter-sort-form-audit').reset();
        currentFilters = {
            sort: '',
            username: '',
            page: '',
            startDate: '',
            endDate: ''
        };
        
        closeFilterModal();
    });
    

    initialize();
})